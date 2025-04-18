const replaceInFile = require('replace-in-file');

function fixDts() {
  try {
    const results = replaceInFile.replaceInFileSync({
      files: 'dist/index.d.ts',
      from: /$/, // Match end of file
      to: '\n\n// CJS export\ndeclare const _default: typeof Wetrocloud;\nexport = _default;',
    });
    console.log('Updated dist/index.d.ts for CJS compatibility:', results);
  } catch (error) {
    console.error('Error updating dist/index.d.ts:', error);
  }
}

fixDts();