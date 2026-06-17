/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Tambahkan konfigurasi images untuk mengizinkan gambar dari Unsplash
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Tambahkan domain lain jika diperlukan
      // Contoh:
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.example.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;