/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/*/**",
      },
      {
        protocol: "https",
<<<<<<< HEAD
        hostname: "utfs.io",
        port: "",
        pathname: "/*/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/*/**",
=======
        hostname: "**",
>>>>>>> 4646dd604e8ce290892fe8f2a08f941b8ee95a57
      },
    ],
  },
};

module.exports = nextConfig;
