/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

const nextConfig = {
  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
      
    };

    return config;
  },
};

module.exports = nextConfig;
// (phase, {nextConfig}) => {
//   return {
//     nextConfig,
//     webpack: (config) => {
//       config.resolve = {
//         fallback: {
//           "fs": false,
//           "path": false,
//           "os": false,
//         }
//       }
//       return config
//     },
//   }
// };

