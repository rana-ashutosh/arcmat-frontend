/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    async rewrites() {
        return [
            {
                source: '/api/proxy/:path*',
                destination: 'https://arcmat-api.vercel.app/api/:path*',
                // destination: 'http://localhost:8000/api/:path*'
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/api/public/uploads/**',
            },
        ],
    },
};

export default nextConfig;
