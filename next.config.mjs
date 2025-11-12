/** @type {import('next').NextConfig} */
const nextConfig = {
  // чтобы работал копирование .next/standalone в Docker
  output: 'standalone',

  // ускоряем CI/докер-сборку
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;