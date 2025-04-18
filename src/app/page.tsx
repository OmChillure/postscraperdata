import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    content: '',
    category: '',
    customCategory: '',
    contentType: '',
    marketingPatterns: [],
    format: {
      hasImages: false,
      hasVideos: false,
      hasLinks: false,
      isThread: false,
      hasCTA: false,
      usesStatistics: false,
      containsEmoji: false,
      hashtagCount: 0,
      listItemCount: 0
    },
    platform: '',
    engagement: {
      views: 0,
      likes: 0,
      reposts: 0,
      comments: 0,
      followerCount: 0
    }
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handlePatternChange = (e) => {
    const { value, checked } = e.target;
    let updatedPatterns = [...formData.marketingPatterns];
    
    if (checked) {
      updatedPatterns.push(value);
    } else {
      updatedPatterns = updatedPatterns.filter(pattern => pattern !== value);
    }
    
    setFormData({
      ...formData,
      marketingPatterns: updatedPatterns
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // Format the data for submission
      const dataToSubmit = {
        ...formData,
        category: formData.category === 'custom' ? formData.customCategory : formData.category
      };
      
      // Submit to API route
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit content');
      }
      
      // Handle success
      setSuccess(true);
      setFormData({
        content: '',
        category: '',
        customCategory: '',
        contentType: '',
        marketingPatterns: [],
        format: {
          hasImages: false,
          hasVideos: false,
          hasLinks: false,
          isThread: false,
          hasCTA: false,
          usesStatistics: false,
          containsEmoji: false,
          hashtagCount: 0,
          listItemCount: 0
        },
        platform: '',
        engagement: {
          views: 0,
          likes: 0,
          reposts: 0,
          comments: 0,
          followerCount: 0
        }
      });
      
      // Hide success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Head>
        <title>Tech Marketing Content Submission</title>
        <meta name="description" content="Submit viral tech marketing content" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold mb-8 text-center">Tech Marketing Content Submission</h1>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            Content submitted successfully!
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Content Section */}
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Basic Content Information</h2>
            
            <div className="mb-4">
              <label htmlFor="content" className="block text-gray-700 mb-2">Content Text</label>
              <textarea 
                id="content" 
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={5} 
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="category" className="block text-gray-700 mb-2">Category</label>
                <select 
                  id="category" 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Developer Tools">Developer Tools</option>
                  <option value="Marketing Tech">Marketing Tech</option>
                  <option value="Fintech">Fintech</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Security">Security</option>
                  <option value="custom">Custom/Other</option>
                </select>
              </div>
              
              {formData.category === 'custom' && (
                <div>
                  <label htmlFor="customCategory" className="block text-gray-700 mb-2">Custom Category</label>
                  <input 
                    type="text" 
                    id="customCategory" 
                    name="customCategory"
                    value={formData.customCategory}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contentType" className="block text-gray-700 mb-2">Content Type</label>
                <select 
                  id="contentType" 
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select content type</option>
                  <option value="promotional">Promotional</option>
                  <option value="educational">Educational</option>
                  <option value="entertaining">Entertaining</option>
                  <option value="inspirational">Inspirational</option>
                  <option value="conversational">Conversational</option>
                  <option value="news">News</option>
                  <option value="storytelling">Storytelling</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="platform" className="block text-gray-700 mb-2">Platform</label>
                <select 
                  id="platform" 
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select platform</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
            </div>
          </section>
          
          {/* Marketing Patterns Section */}
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Marketing Patterns</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="pattern-question" 
                  value="question"
                  checked={formData.marketingPatterns.includes('question')}
                  onChange={handlePatternChange}
                  className="mt-1"
                />
                <label htmlFor="pattern-question" className="ml-2">Uses questions</label>
              </div>
              
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="pattern-list" 
                  value="list"
                  checked={formData.marketingPatterns.includes('list')}
                  onChange={handlePatternChange}
                  className="mt-1"
                />
                <label htmlFor="pattern-list" className="ml-2">Numbered or bulleted list</label>
              </div>
              
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="pattern-how-to" 
                  value="how-to"
                  checked={formData.marketingPatterns.includes('how-to')}
                  onChange={handlePatternChange}
                  className="mt-1"
                />
                <label htmlFor="pattern-how-to" className="ml-2">How-to guide/tutorial</label>
              </div>
              
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="pattern-cta" 
                  value="call-to-action"
                  checked={formData.marketingPatterns.includes('call-to-action')}
                  onChange={handlePatternChange}
                  className="mt-1"
                />
                <label htmlFor="pattern-cta" className="ml-2">Call-to-action</label>
              </div>
              
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="pattern-stats" 
                  value="statistics"
                  checked={formData.marketingPatterns.includes('statistics')}
                  onChange={handlePatternChange}
                  className="mt-1"
                />
                <label htmlFor="pattern-stats" className="ml-2">Uses statistics/data</label>
              </div>
              
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="pattern-social-proof" 
                  value="social-proof"
                  checked={formData.marketingPatterns.includes('social-proof')}
                  onChange={handlePatternChange}
                  className="mt-1"
                />
                <label htmlFor="pattern-social-proof" className="ml-2">Social proof/testimonial</label>
              </div>
              
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="pattern-problem-solution" 
                  value="problem-solution"
                  checked={formData.marketingPatterns.includes('problem-solution')}
                  onChange={handlePatternChange}
                  className="mt-1"
                />
                <label htmlFor="pattern-problem-solution" className="ml-2">Problem-solution structure</label>
              </div>
            </div>
          </section>
          
          {/* Format Section */}
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Format Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="hasImages" 
                  name="format.hasImages"
                  checked={formData.format.hasImages}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label htmlFor="hasImages" className="ml-2">Has images</label>
              </div>
              
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="hasVideos" 
                  name="format.hasVideos"
                  checked={formData.format.hasVideos}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label htmlFor="hasVideos" className="ml-2">Has videos</label>
              </div>
              
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="hasLinks" 
                  name="format.hasLinks"
                  checked={formData.format.hasLinks}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label htmlFor="hasLinks" className="ml-2">Has links</label>
              </div>
              
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="isThread" 
                  name="format.isThread"
                  checked={formData.format.isThread}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label htmlFor="isThread" className="ml-2">Is thread/multi-post</label>
              </div>
              
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="hasCTA" 
                  name="format.hasCTA"
                  checked={formData.format.hasCTA}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label htmlFor="hasCTA" className="ml-2">Has call-to-action</label>
              </div>
              
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="usesStatistics" 
                  name="format.usesStatistics"
                  checked={formData.format.usesStatistics}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label htmlFor="usesStatistics" className="ml-2">Uses statistics</label>
              </div>
              
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="containsEmoji" 
                  name="format.containsEmoji"
                  checked={formData.format.containsEmoji}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label htmlFor="containsEmoji" className="ml-2">Contains emoji</label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hashtagCount" className="block text-gray-700 mb-2">Number of hashtags</label>
                <input 
                  type="number" 
                  id="hashtagCount" 
                  name="format.hashtagCount"
                  value={formData.format.hashtagCount}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="listItemCount" className="block text-gray-700 mb-2">List item count (if applicable)</label>
                <input 
                  type="number" 
                  id="listItemCount" 
                  name="format.listItemCount"
                  value={formData.format.listItemCount}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>
          
          {/* Engagement Section */}
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Engagement Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="views" className="block text-gray-700 mb-2">Views/Impressions</label>
                <input 
                  type="number" 
                  id="views" 
                  name="engagement.views"
                  value={formData.engagement.views}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="likes" className="block text-gray-700 mb-2">Likes</label>
                <input 
                  type="number" 
                  id="likes" 
                  name="engagement.likes"
                  value={formData.engagement.likes}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="reposts" className="block text-gray-700 mb-2">Reposts/Retweets</label>
                <input 
                  type="number" 
                  id="reposts" 
                  name="engagement.reposts"
                  value={formData.engagement.reposts}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="comments" className="block text-gray-700 mb-2">Comments/Replies</label>
                <input 
                  type="number" 
                  id="comments" 
                  name="engagement.comments"
                  value={formData.engagement.comments}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="followerCount" className="block text-gray-700 mb-2">Creator's Follower Count</label>
              <input 
                type="number" 
                id="followerCount" 
                name="engagement.followerCount"
                value={formData.engagement.followerCount}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </section>
          
          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Content'}
          </button>
        </form>
      </main>
    </div>
  );
}