# npm publish --access public

# npm version patch  # For bug fixes
# npm version minor  # For new features
# npm version major  # For breaking changes

# npm publish


#scoped project
# {
#   "name": "@your-username/my-awesome-package",
#   "version": "1.0.0",
#   "main": "index.js"
# }

#!/bin/bash

# Ask for version type using select
echo "Select the type of version update:"
select version_type in "patch" "minor" "major"; do
  case $version_type in
    patch|minor|major)
      echo "You selected '$version_type' update."
      break
      ;;
    *)
      echo "Invalid selection. Please choose 1, 2, or 3."
      ;;
  esac
done

# Run npm version
npm version $version_type

# Publish to npm
echo "Publishing to npm with --access public..."
npm publish --access public

echo "✅ Deployment complete!"

