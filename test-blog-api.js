// Test script for Blog API functionality
const axios = require('axios');

const API_BASE_URL = 'https://gems-of-truth.vercel.app';

// Test data for adding a blog
const testBlogData = {
    "title": "NEWSTART: 8 Principles for healthy living",
    "description": "Discover these eight Principles of healthy living",
    "body": "In this chapter, we discuss eight ways that you can improve your life and be more happier",
    "read_time": "8 minutes",
    "tag_list": "Sunshine God Air Water Health Relationship Nutrition"
};

// Mock authentication token (you would need a real token)
const mockToken = "your-auth-token-here";

async function testBlogAPI() {
    console.log('🧪 Testing Blog API Endpoints...\n');
    
    try {
        // Test 1: Get All Blogs
        console.log('1️⃣ Testing GET /blogs/all-blogs');
        const getAllResponse = await axios.get(`${API_BASE_URL}/blogs/all-blogs`);
        console.log('✅ GET All Blogs - Status:', getAllResponse.status);
        console.log('📊 Number of blogs found:', getAllResponse.data.blogs ? getAllResponse.data.blogs.length : 0);
        
        if (getAllResponse.data.blogs && getAllResponse.data.blogs.length > 0) {
            const firstBlog = getAllResponse.data.blogs[0];
            console.log('📝 First blog sample:');
            console.log('   - ID:', firstBlog.id);
            console.log('   - Title:', firstBlog.title);
            console.log('   - Author:', firstBlog.author ? firstBlog.author.first_name + ' ' + firstBlog.author.last_name : 'No author');
            console.log('   - Tags:', firstBlog.tags);
            
            // Test 2: Get Single Blog Details
            console.log('\n2️⃣ Testing GET /blogs/blog-detail/{blogId}/');
            const blogDetailResponse = await axios.get(`${API_BASE_URL}/blogs/blog-detail/${firstBlog.id}/`);
            console.log('✅ GET Blog Detail - Status:', blogDetailResponse.status);
            console.log('📄 Blog detail retrieved successfully');
        }
        
        // Test 3: Add Blog (requires authentication)
        console.log('\n3️⃣ Testing POST /blogs/add-blog (requires authentication)');
        console.log('⚠️  This requires a valid authentication token');
        console.log('📝 Test data prepared:', testBlogData);
        
        // Uncomment this if you have a valid token:
        /*
        const addBlogResponse = await axios.post(`${API_BASE_URL}/blogs/add-blog`, testBlogData, {
            headers: {
                'Content-Type': 'application/json',
                'Token': mockToken
            }
        });
        console.log('✅ Add Blog - Status:', addBlogResponse.status);
        console.log('🆕 New blog created:', addBlogResponse.data.blog);
        */
        
    } catch (error) {
        console.error('❌ Error testing API:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

console.log('🚀 Starting Blog API Tests...');
testBlogAPI();
