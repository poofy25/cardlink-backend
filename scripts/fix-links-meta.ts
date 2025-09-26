import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { LinkValidatorService } from 'src/common/link-validator.service';
import { Repository } from 'typeorm';
import { Link } from 'src/entities/link.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LinkTypes, LinkMetaSchemas, LinkType } from 'src/configs/links/link-schemas';
import { BaseLinkDto } from 'src/links/dto/base-link.dto';

interface FixOptions {
  dryRun: boolean;
  batchSize: number;
}

/**
 * Validates and cleans meta data according to the link type schema
 * Removes invalid fields and keeps only schema-compliant fields
 */
function validateAndCleanMeta(linkType: LinkType, meta: Record<string, unknown> | null): Record<string, unknown> {
  if (!meta) {
    return { rawInput: '' };
  }

  // Get the schema for this link type
  const schema = LinkMetaSchemas[linkType];
  if (!schema) {
    // If no schema found, return only rawInput
    return { rawInput: (meta.rawInput as string) || '' };
  }

  try {
    // Parse and validate the meta data against the schema
    const result = schema.safeParse(meta);
    
    if (result.success) {
      // If validation succeeds, return the cleaned data
      return result.data;
    } else {
      // If validation fails, return only the rawInput field
      console.log(`   ⚠️  Meta validation failed for ${linkType}:`, result.error.issues.map(i => i.message).join(', '));
      return { rawInput: (meta.rawInput as string) || '' };
    }
  } catch (error) {
    // If parsing fails, return only rawInput
    console.log(`   ⚠️  Meta parsing error for ${linkType}:`, (error as Error).message);
    return { rawInput: (meta.rawInput as string) || '' };
  }
}

async function fixLinksMeta(options: FixOptions = { dryRun: false, batchSize: 100 }) {
  console.log('🔧 Starting link meta fix and validation...\n');
  
  if (options.dryRun) {
    console.log('🧪 DRY RUN MODE - No changes will be made to database\n');
  }

  // Create NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    // Get services
    const linkValidatorService = app.get(LinkValidatorService);
    const linkRepository = app.get<Repository<Link>>(getRepositoryToken(Link));

    // Get total count
    const totalCount = await linkRepository.count();
    console.log(`📊 Total links in database: ${totalCount}\n`);

    if (totalCount === 0) {
      console.log('✅ No links found in database');
      return;
    }

    let processedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    // Process in batches
    const totalBatches = Math.ceil(totalCount / options.batchSize);
    console.log(`📦 Processing ${totalBatches} batches of ${options.batchSize} links each...\n`);

    for (let batchNumber = 0; batchNumber < totalBatches; batchNumber++) {
      const offset = batchNumber * options.batchSize;
      
      console.log(`🔄 Processing batch ${batchNumber + 1}/${totalBatches} (offset: ${offset})`);
      
      // Fetch batch of links
      const links = await linkRepository.find({
        skip: offset,
        take: options.batchSize,
        relations: ['cardLink', 'cardLink.owner']
      });

      if (links.length === 0) {
        console.log('   No more links to process');
        break;
      }

      console.log(`   Found ${links.length} links in this batch`);

      // Process each link in the batch
      for (const link of links) {
        try {
          // First, validate and clean the meta data according to the schema
          const cleanedMeta = validateAndCleanMeta(link.type as LinkType, link.meta);
          
          // Convert Link entity to BaseLinkDto format - exactly like LinkValidatorService expects
          const dto: BaseLinkDto = {
            type: link.type as LinkTypes,
            title: link.title,
            orderIndex: link.orderIndex,
            isActive: link.isActive,
            meta: cleanedMeta
          };

          // Use the exact same processLink function as LinkValidatorService
          const result = linkValidatorService.processLink(dto);
          const processedLink = result.processedLink;

          // Determine what needs to be updated by comparing with current link state
          const updates: Partial<Link> = {};
          let needsUpdate = false;

          // 1. Update meta data - check if cleaned meta is different from original
          const newMeta = processedLink.meta;
          const originalMetaChanged = JSON.stringify(cleanedMeta) !== JSON.stringify(link.meta);
          const processedMetaChanged = JSON.stringify(newMeta) !== JSON.stringify(cleanedMeta);
          
          if (originalMetaChanged || processedMetaChanged) {
            updates.meta = newMeta;
            needsUpdate = true;
            console.log(`   📝 Meta needs update for link ${link.id}`);
            
            if (originalMetaChanged) {
              console.log(`      Cleaned invalid fields from meta`);
            }
            if (processedMetaChanged) {
              console.log(`      Updated meta with validation results`);
            }
            if (processedLink.validationErrors && Object.keys(processedLink.validationErrors).length > 0) {
              console.log(`      Adding validation errors: ${JSON.stringify(processedLink.validationErrors)}`);
            }
          }

          // 2. Update isIncomplete status
          if (link.isIncomplete !== processedLink.isIncomplete) {
            updates.isIncomplete = processedLink.isIncomplete;
            needsUpdate = true;
            console.log(`   🔄 Incomplete status: ${link.isIncomplete} → ${processedLink.isIncomplete}`);
          }

          // 3. Update URL
          if (link.url !== processedLink.url) {
            updates.url = processedLink.url;
            needsUpdate = true;
            console.log(`   🔗 URL: ${link.url || 'null'} → ${processedLink.url || 'null'}`);
          }

          // 4. Update isActive (set to false for incomplete links) - same logic as LinkValidatorService
          const newIsActive = processedLink.isActive;
          if (link.isActive !== newIsActive) {
            updates.isActive = newIsActive;
            needsUpdate = true;
            console.log(`   👁️  Active status: ${link.isActive} → ${newIsActive}`);
          }

          // Update the link if needed
          if (needsUpdate) {
            if (!options.dryRun) {
              await linkRepository.update(link.id, updates as any);
            }
            updatedCount++;
            
            console.log(`   ✅ Updated link ${link.id} (${link.type})`);
            
            // Show validation errors if any
            if (processedLink.validationErrors && Object.keys(processedLink.validationErrors).length > 0) {
              console.log(`      Validation errors: ${JSON.stringify(processedLink.validationErrors)}`);
            }
          } else {
            console.log(`   ✓ Link ${link.id} is already correct`);
          }

          processedCount++;

        } catch (error) {
          errorCount++;
          console.error(`   ❌ Error processing link ${link.id}:`, (error as Error).message);
        }
      }

      console.log(`   ✅ Batch ${batchNumber + 1} completed`);
      console.log(`   Progress: ${processedCount}/${totalCount} links processed\n`);

      // Add a small delay between batches
      if (batchNumber < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log('📊 FIX SUMMARY');
    console.log('==============');
    console.log(`Total Links Processed: ${processedCount}`);
    console.log(`Links Updated: ${updatedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Success Rate: ${((processedCount - errorCount) / processedCount * 100).toFixed(1)}%`);
    
    if (options.dryRun) {
      console.log('\n🧪 This was a dry run - no actual changes were made');
      console.log('Run without --dry-run to apply changes');
    } else {
      console.log('\n✅ Link meta fix completed successfully');
    }

  } catch (error) {
    console.error('❌ Error during fix:', error);
  } finally {
    await app.close();
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const options: FixOptions = {
    dryRun: args.includes('--dry-run'),
    batchSize: parseInt(args.find(arg => arg.startsWith('--batch-size='))?.split('=')[1] || '100')
  };

  console.log('🔧 Fix Options:');
  console.log(`- Dry Run: ${options.dryRun ? '✅' : '❌'}`);
  console.log(`- Batch Size: ${options.batchSize}`);
  console.log('');

  fixLinksMeta(options)
    .then(() => {
      console.log('\n✅ Link meta fix completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { fixLinksMeta };
