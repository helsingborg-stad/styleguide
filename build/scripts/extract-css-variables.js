#!/usr/bin/env node

/**
 * CSS Variables Extraction Script
 *
 * Extracts CSS custom properties from _var_css.scss and generates
 * a JSON metadata file with type information for each variable.
 *
 * Usage: node build/scripts/extract-css-variables.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  sourceFile: path.join(__dirname, '../../source/sass/setting/_var_css.scss'),
  outputFile: path.join(__dirname, '../../dist/data/css-variables.json'),
};

/**
 * Type inference based on CSS variable name and value
 * @param {string} name - The CSS variable name
 * @param {string} value - The CSS variable value
 * @returns {string} - The inferred type
 */
function inferType(name, value) {
  value = value.trim();

  // Radius: specifically for --radius-* variables (should use sliders)
  if (/^--radius-/.test(name)) {
    return 'radius';
  }

  // Color: #hex, rgb(), rgba(), hsl(), hsla()
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) {
    return 'color';
  }
  if (/^rgba?\s*\(/.test(value) || /^hsla?\s*\(/.test(value)) {
    return 'color';
  }

  // Size: px, rem, em, %, vh, vw, vmin, vmax
  if (/\d+\s*(px|rem|em|%|vh|vw|vmin|vmax)/i.test(value)) {
    return 'size';
  }

  // Number: pure numbers or calc() expressions
  if (/^\d+(\.\d+)?$/.test(value)) {
    return 'number';
  }
  if (/^calc\s*\(/.test(value)) {
    return 'number';
  }

  // Font: quoted strings (font families)
  if (/^["'].*["']/.test(value)) {
    return 'font';
  }

  // Shadow: drop-shadow() functions
  if (/drop-shadow\s*\(/.test(value)) {
    return 'shadow';
  }

  // Generic: fallback for everything else (including var() references)
  return 'generic';
}

/**
 * Format variable name for display
 * @param {string} name - CSS variable name (e.g., --color--primary)
 * @returns {string} - Formatted name (e.g., Primary)
 */
function formatName(name) {
  return name
    .replace(/^--/, '')
    .replace(/--/g, ' ')
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extract CSS variables from SCSS file content
 * @param {string} content - File content
 * @returns {Object} - Extracted variables data
 */
function extractVariables(content) {
  const variables = [];
  const categorySet = new Set();
  let currentCategory = 'UNCATEGORIZED';

  // Split content into lines for easier processing
  const lines = content.split('\n');

  let inRootBlock = false;
  let inCommentBlock = false;
  let commentLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for :root block start
    if (line.includes(':root')) {
      inRootBlock = true;
      continue;
    }

    // Check for :root block end
    if (inRootBlock && line.startsWith('}') && !inCommentBlock) {
      inRootBlock = false;
      continue;
    }

    // Only process lines inside :root block
    if (!inRootBlock) {
      continue;
    }

    // Check for multi-line comment block start
    if (line.includes('/**')) {
      inCommentBlock = true;
      commentLines = [];
      continue;
    }

    // Check for multi-line comment block end
    if (inCommentBlock && line.includes('*/')) {
      inCommentBlock = false;

      // Extract category from comment lines
      // Look for lines with only letters, spaces, and hyphens (first non-empty line)
      for (const commentLine of commentLines) {
        const cleanLine = commentLine.replace(/^\*\s*/, '').trim();
        // Match lines that look like category headers (letters, spaces, hyphens only)
        if (/^[A-Za-z\s-]+$/.test(cleanLine) && cleanLine.length > 0 && cleanLine.length < 50) {
          currentCategory = cleanLine.toUpperCase();
          categorySet.add(currentCategory);
          break;
        }
      }
      commentLines = [];
      continue;
    }

    // Collect comment lines
    if (inCommentBlock) {
      commentLines.push(line);
      continue;
    }

    // Extract CSS variable declaration
    // Pattern: --variable-name: value;
    const varMatch = line.match(/^(--[a-z0-9-]+)\s*:\s*([^;]+);/i);
    if (varMatch) {
      const name = varMatch[1];
      const value = varMatch[2].trim();

      // Skip derived shadow variables (--shadow-0 through --shadow-5, --shadow-detail-0 through --shadow-detail-5)
      // These are calculated from --shadow-amount and --shadow-detail-amount
      // Users should only edit the multipliers, not the individual shadow values
      if (/^--shadow-\d+$/.test(name) || /^--shadow-detail-\d+$/.test(name)) {
        continue;
      }

      // Skip z-index variables (--level-1 through --level-9)
      // These are used for stacking contexts and shouldn't be edited by users
      if (/^--level-\d+$/.test(name)) {
        continue;
      }

      const type = inferType(name, value);

      variables.push({
        name,
        defaultValue: value,
        type,
        category: currentCategory,
        description: formatName(name),
      });
    }
  }

  return {
    variables,
    categories: Array.from(categorySet).sort(),
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Main execution function
 */
function main() {
  console.log('🔍 Extracting CSS variables...\n');

  try {
    // Check if source file exists
    if (!fs.existsSync(CONFIG.sourceFile)) {
      throw new Error(`Source file not found: ${CONFIG.sourceFile}`);
    }

    // Read source file
    console.log(`📖 Reading: ${CONFIG.sourceFile}`);
    const content = fs.readFileSync(CONFIG.sourceFile, 'utf8');

    // Extract variables
    console.log('⚙️  Parsing CSS variables and inferring types...');
    const data = extractVariables(content);

    // Log statistics
    console.log(`\n📊 Statistics:`);
    console.log(`   - Variables found: ${data.variables.length}`);
    console.log(`   - Categories: ${data.categories.length}`);

    // Group by type for statistics
    const typeStats = data.variables.reduce((acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1;
      return acc;
    }, {});

    console.log(`\n📝 Types:`);
    Object.entries(typeStats).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count}`);
    });

    console.log(`\n📂 Categories:`);
    data.categories.forEach(cat => {
      const count = data.variables.filter(v => v.category === cat).length;
      console.log(`   - ${cat}: ${count} variables`);
    });

    // Ensure output directory exists
    const outputDir = path.dirname(CONFIG.outputFile);
    if (!fs.existsSync(outputDir)) {
      console.log(`\n📁 Creating output directory: ${outputDir}`);
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write output file
    console.log(`\n💾 Writing: ${CONFIG.outputFile}`);
    fs.writeFileSync(
      CONFIG.outputFile,
      JSON.stringify(data, null, 2),
      'utf8'
    );

    console.log('\n✅ Extraction complete!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { extractVariables, inferType };
