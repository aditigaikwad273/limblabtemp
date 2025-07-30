const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config")
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    unstable_enablePackageExports: false, 
  },
}

module.exports = wrapWithReanimatedMetroConfig(
  mergeConfig(getDefaultConfig(__dirname), config)
);
