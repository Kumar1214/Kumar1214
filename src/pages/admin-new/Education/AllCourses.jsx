import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, BookOpen, Search, Filter, MoreVertical, X, ChevronLeft, Save, Video, FileText, HelpCircle, CheckCircle, Calendar } from 'lucide-react';
import RichTextEditor from '../../../components/RichTextEditor';
import ImageUploader from '../../../components/ImageUploader';
import FileUploader from '../../../components/FileUploader';
import { contentService } from '../../../services/api';
import { useData } from '../../../context/useData';
import { DataContext } from '../../../context/DataContext';
import { useContext } from 'react';
import AnalyticsGrid from '../../../components/admin/analytics/AnalyticsGrid';
import TrendingChart from '../../../components/admin/analytics/TrendingChart';
import TrendingModal from '../../../components/admin/analytics/TrendingModal';
import { Eye, Share2, Bookmark, TrendingUp, DollarSign, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';



const CourseManagement = () => {
  const { refreshCourses: refreshGlobalCourses, currentUser } = useData();
  const { getModuleAnalytics, getTrendingContent } = useContext(DataContext);

  // Helper for safe array handling (JSON or Array)
  const parseArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch (e) {
      console.error("Error parsing array field:", e);
      return [];
    }
  };

  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [trending, setTrending] = useState([]);
  const [showTrendingModal, setShowTrendingModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list', 'create', 'edit'
  const [activeTab, setActiveTab] = useState('course'); // 'course', 'course-include', 'what-learns', 'course-chapter', 'course-class', etc.
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({});

  const [newInclude, setNewInclude] = useState('');
  const [newLearn, setNewLearn] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newReview, setNewReview] = useState({ user: '', rating: '5', comment: '' });
  const [newClass, setNewClass] = useState({ title: '', type: 'Video', duration: '', url: '' });
  const [showClassForm, setShowClassForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterConfig, setFilterConfig] = useState({ category: '', status: '', date: '' });
  const [uploading, setUploading] = useState(false);

  // Fetch Courses and Categories
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        contentService.getCourses({ limit: 100 }),
        contentService.getCourseCategories()
      ]);

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.data);
        setFilteredCourses(coursesRes.data.data);
      }

      // Fix: Handle both direct array and success/data object structure
      if (Array.isArray(categoriesRes.data)) {
        setCategories(categoriesRes.data);
      } else if (categoriesRes.data && categoriesRes.data.success) {
        setCategories(categoriesRes.data.data);
      } else if (categoriesRes.data && Array.isArray(categoriesRes.data.data)) {
        // Fallback for some potential response structures
        setCategories(categoriesRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching courses data:", error);
    } finally {
      setLoading(false);
    }

    // Fetch Analytics
    try {
      const analyticsData = await getModuleAnalytics('course');
      if (analyticsData) setAnalytics(analyticsData);

      const trendingData = await getTrendingContent('course', 10);
      if (trendingData) setTrending(trendingData);
    } catch (err) {
      console.error("Error fetching course analytics:", err);
    }
  }, [getModuleAnalytics, getTrendingContent]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Handle Delete
  const handleDeleteCourse = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await contentService.deleteCourse(id);
        toast.success("Course deleted successfully");
        fetchCourses(); // Refresh list
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("Failed to delete course");
      }
    }
  };

  const handleAddItem = (field, item) => {
    setFormData(prev => {
      const currentArr = parseArrayField(prev[field]);
      return { ...prev, [field]: [...currentArr, item] };
    });
  };

  const handleRemoveItem = (field, index) => {
    setFormData(prev => {
      const currentArr = parseArrayField(prev[field]);
      const newArray = [...currentArr];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  // Initialize form data when creating/editing
  const initForm = (course = null) => {
    if (course) {
      setFormData(course);
      setEditingCourse(course);
      setView('edit');
    } else {
      setFormData({
        title: '',
        instructor: currentUser?.name || currentUser?.email || 'Admin',
        category: '',
        subCategory: '',
        language: 'English',
        price: 0,
        status: 'draft',
        description: '',
        level: 'Beginner',
        duration: '',
        image: '',
        youtubeUrl: '',
        includes: [],
        whatLearns: [],
        chapters: [],
        syllabus: [], // Lessons
        relatedCourses: [],
        faqs: [],
        reviews: [],
        studyMaterial: []
      });
      setEditingCourse(null);
      setView('create');
    }
    setActiveTab('course');
  };

  const handleSave = async () => {
    try {
      if (editingCourse) {
        await contentService.updateCourse(editingCourse.id || editingCourse.id, formData);
        toast.success('Course updated successfully!');
      } else {
        await contentService.createCourse(formData);
        toast.success('Course created successfully!');
      }
      fetchCourses();
      refreshGlobalCourses();
      setView('list');
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Failed to save course. Check console for details.");
    }
  };

  // Render List View
  if (view === 'list') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>All Courses</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowFilterModal(true)}
              style={{ padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: '6px', background: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Filter size={16} /> Filter
            </button>
            <button
              onClick={() => initForm()}
              style={{ padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={16} /> Add Course
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading Courses...</div>
        ) : (
          <>
            <AnalyticsGrid
              metrics={[
                { title: 'Total Courses', value: analytics?.totalItems || courses.length, icon: BookOpen, color: 'indigo' },
                { title: 'Total Enrollments', value: analytics?.totalEnrollments?.toLocaleString() || '1,250', icon: Users, color: 'blue', trend: 'up', trendValue: 15 },
                { title: 'Total Revenue', value: analytics?.totalRevenue ? `₹${analytics.totalRevenue.toLocaleString()}` : "₹45,600", icon: DollarSign, color: 'green', trend: 'up', trendValue: 22 },
                { title: 'Total Shares', value: analytics?.overview?.totalShares?.toLocaleString() || '340', icon: Share2, color: 'purple' }
              ]}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginBottom: '32px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Enrolment Trends</h3>
                  <button
                    onClick={() => setShowTrendingModal(true)}
                    style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}
                  >
                    <TrendingUp size={16} /> View Top 50
                  </button>
                </div>
                <TrendingChart data={trending.length > 0 ? trending : courses.slice(0, 8)} dataKey="students" />
              </div>

              <div style={{ backgroundColor: '#0c2d50', borderRadius: '12px', padding: '24px', color: 'white', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 12px 0' }}>Performance Insight</h3>
                <p style={{ fontSize: '0.9rem', color: '#E5E7EB', lineHeight: 1.5, flex: 1 }}>
                  Your "Ayurveda" courses are seeing a 35% higher completion rate compared to others. Consider bundle offers for "Spirituality" content.
                </p>
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ color: '#9CA3AF' }}>Best Seller</span>
                    <span style={{ fontWeight: 600 }}>Yoga Basics</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#9CA3AF' }}>Avg. Rating</span>
                    <span style={{ fontWeight: 600 }}>4.8 / 5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {filteredCourses.map(course => (
                <div key={course.id || course.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: '180px' }}>
                    <img src={course.image?.startsWith('http') ? course.image : `${import.meta.env.VITE_API_URL || 'https://gaugyanworld.org'}${course.image || ''}`} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.8rem' }}>
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>{course.title || 'Untitled Course'}</h3>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}><MoreVertical size={16} color="#6B7280" /></button>
                    </div>
                    <div style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '16px' }}>
                      {typeof course.instructor === 'object' ? (course.instructor?.email || course.instructor?.name || 'Unknown Instructor') : course.instructor}
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Status:</span>
                        <label className="switch" style={{ transform: 'scale(0.8)' }}>
                          <input type="checkbox" checked={course.status !== 'draft'} readOnly />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => initForm(course)} style={{ padding: '6px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', color: '#3B82F6' }}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteCourse(course.id || course.id)} style={{ padding: '6px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', color: '#EF4444' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <TrendingModal
              isOpen={showTrendingModal}
              onClose={() => setShowTrendingModal(false)}
              title="Top Performing Courses"
              data={trending.length > 0 ? trending : courses}
              metricKey="students"
              metricLabel="Enrolled"
            />
          </>
        )}

        {/* Filter Modal */}
        {showFilterModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ padding: '24px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'white', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Filter Courses</h3>
                <button onClick={() => setShowFilterModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Category</label>
                <select
                  value={filterConfig.category}
                  onChange={e => setFilterConfig({ ...filterConfig, category: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Status</label>
                <select
                  value={filterConfig.status}
                  onChange={e => setFilterConfig({ ...filterConfig, status: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                >
                  <option value="">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Date Created</label>
                <input
                  type="date"
                  value={filterConfig.date}
                  onChange={e => setFilterConfig({ ...filterConfig, date: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button onClick={() => {
                  setFilterConfig({ category: '', status: '', date: '' });
                  setFilteredCourses(courses);
                  setShowFilterModal(false);
                }} style={{ padding: '8px 16px', background: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer' }}>Reset</button>
                <button onClick={() => {
                  let res = courses;
                  if (filterConfig.category) res = res.filter(c => c.category === filterConfig.category);
                  if (filterConfig.status) {
                    if (filterConfig.status === 'published') res = res.filter(c => c.status !== 'draft');
                    else res = res.filter(c => c.status === 'draft');
                  }
                  if (filterConfig.date) {
                    res = res.filter(c => {
                      if (!c.createdAt) return false;
                      try {
                        return new Date(c.createdAt).toISOString().split('T')[0] === filterConfig.date;
                      } catch (e) { return false; }
                    });
                  }
                  setFilteredCourses(res);
                  setShowFilterModal(false);
                }} style={{ padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Apply Filters</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Edit/Create View
  const tabs = [
    { id: 'course', label: 'Course', icon: BookOpen },
    { id: 'course-include', label: 'CourseInclude', icon: CheckCircle },
    { id: 'what-learns', label: 'WhatLearns', icon: HelpCircle },
    { id: 'course-chapter', label: 'CourseChapter', icon: FileText },
    { id: 'course-class', label: 'CourseClass', icon: Video },
    { id: 'related-course', label: 'RelatedCourse', icon: BookOpen },
    { id: 'question', label: 'Question', icon: HelpCircle },
    { id: 'question', label: 'Question', icon: HelpCircle },
    { id: 'review-rating', label: 'ReviewRating', icon: CheckCircle },
    { id: 'study-material', label: 'Study Material', icon: FileText },
  ];

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
      {/* Sidebar Navigation */}
      <div className="card" style={{ width: '250px', padding: '12px 0', position: 'sticky', top: '20px' }}>
        <div style={{ padding: '0 16px 12px', borderBottom: '1px solid #E5E7EB', marginBottom: '8px' }}>
          <button onClick={() => setView('list')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '0.9rem' }}>
            <ChevronLeft size={16} /> Back to Courses
          </button>
        </div>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'none',
              color: activeTab === tab.id ? 'white' : '#4B5563',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '0.95rem'
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="card" style={{ flex: 1, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E5E7EB' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{tabs.find(t => t.id === activeTab)?.label}</h2>
          <button onClick={handleSave} disabled={uploading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', backgroundColor: uploading ? '#9CA3AF' : 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
            <Save size={16} /> {uploading ? 'Uploading...' : 'Save'}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'course' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Category *</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Language *</label>
                <select
                  value={formData.language}
                  onChange={e => setFormData({ ...formData, language: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Sanskrit</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Course Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                placeholder="Enter Course Title"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Instructor Name</label>
              <input
                type="text"
                value={formData.instructor}
                onChange={e => setFormData({ ...formData, instructor: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                placeholder="Enter Instructor Name"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Description</label>
              <RichTextEditor
                value={formData.description}
                onChange={content => setFormData({ ...formData, description: content })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Level</label>
                <select
                  value={formData.level}
                  onChange={e => setFormData({ ...formData, level: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  placeholder="e.g. 10 hours"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Course Image</label>
              <ImageUploader
                value={formData.image ? [formData.image] : []}
                onChange={urls => setFormData({ ...formData, image: urls[0] })}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>YouTube URL (Optional)</label>
              <input
                type="url"
                value={formData.youtubeUrl || ''}
                onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '4px' }}>
                If provided, YouTube video will be shown on course detail page instead of thumbnail image
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured || false}
                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="featured" style={{ cursor: 'pointer', fontWeight: 500 }}>Mark as Featured Course</label>
            </div>
          </div>
        )
        }

        {
          activeTab === 'course-class' && (
            <div>
              {!showClassForm ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                  <button onClick={() => setShowClassForm(true)} style={{ padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    + Add Course Class
                  </button>
                </div>
              ) : (
                <div style={{ padding: '20px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '20px', background: '#F9FAFB' }}>
                  <h4 style={{ marginTop: 0, marginBottom: '16px' }}>Add New Class</h4>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <input type="text" placeholder="Class Title" value={newClass.title} onChange={e => setNewClass({ ...newClass, title: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <select value={newClass.type} onChange={e => setNewClass({ ...newClass, type: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
                        <option>Video</option>
                        <option>Audio</option>
                        <option>Document</option>
                      </select>
                      <input type="text" placeholder="Duration (e.g. 10:00)" value={newClass.duration} onChange={e => setNewClass({ ...newClass, duration: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Resource File (Video/Audio/Doc)</label>
                      <FileUploader
                        value={newClass.url}
                        onChange={(url) => setNewClass({ ...newClass, url })}
                        accept={newClass.type === 'Video' ? 'video/*' : newClass.type === 'Audio' ? 'audio/*' : '.pdf,.doc,.docx'}
                        label={`Upload ${newClass.type}`}
                      />
                      <div style={{ textAlign: 'center', margin: '8px 0', color: '#6B7280', fontSize: '0.9rem' }}>- OR -</div>
                      <input
                        type="text"
                        placeholder="Paste External URL"
                        value={newClass.url}
                        onChange={e => setNewClass({ ...newClass, url: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button onClick={() => setShowClassForm(false)} style={{ padding: '8px 16px', border: '1px solid #D1D5DB', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>Cancel</button>
                      <button onClick={() => {
                        if (newClass.title) {
                          handleAddItem('syllabus', newClass);
                          setNewClass({ title: '', type: 'Video', duration: '', url: '' });
                          setShowClassForm(false);
                        }
                      }} style={{ padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add Class</button>
                    </div>
                  </div>
                </div>
              )}

              {/* List of classes/lessons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {parseArrayField(formData.syllabus).length > 0 ? (
                  parseArrayField(formData.syllabus).map((cls, i) => (
                    <div key={i} style={{ padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{cls.title}</div>
                        <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>{cls.type} • {cls.duration}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ padding: '6px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer' }}><Edit size={16} /></button>
                        <button onClick={() => handleRemoveItem('syllabus', i)} style={{ padding: '6px', border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#B91C1C', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF', border: '2px dashed #E5E7EB', borderRadius: '8px' }}>
                    No classes added yet. Click "Add Course Class" to start.
                  </div>
                )}
              </div>
            </div>
          )
        }

        {/* Course Includes Tab */}
        {
          activeTab === 'course-include' && (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="e.g. Full lifetime access"
                  value={newInclude}
                  onChange={(e) => setNewInclude(e.target.value)}
                  style={{ flex: 1, padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px' }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && newInclude) { handleAddItem('includes', newInclude); setNewInclude(''); } }}
                />
                <button onClick={() => {
                  if (newInclude) { handleAddItem('includes', newInclude); setNewInclude(''); }
                }} style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {parseArrayField(formData.includes).map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle size={16} color="var(--color-primary)" />
                      <span>{item}</span>
                    </div>
                    <button onClick={() => handleRemoveItem('includes', i)} style={{ color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                ))}
                {parseArrayField(formData.includes).length === 0 && <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>No includes added yet.</div>}
              </div>
            </div>
          )
        }

        {/* What Learns Tab */}
        {
          activeTab === 'what-learns' && (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="e.g. Build a full-stack app"
                  value={newLearn}
                  onChange={(e) => setNewLearn(e.target.value)}
                  style={{ flex: 1, padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px' }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && newLearn) { handleAddItem('whatLearns', newLearn); setNewLearn(''); } }}
                />
                <button onClick={() => {
                  if (newLearn) { handleAddItem('whatLearns', newLearn); setNewLearn(''); }
                }} style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {parseArrayField(formData.whatLearns).map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <HelpCircle size={16} color="var(--color-primary)" />
                      <span>{item}</span>
                    </div>
                    <button onClick={() => handleRemoveItem('whatLearns', i)} style={{ color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                ))}
                {parseArrayField(formData.whatLearns).length === 0 && <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>No learning points added yet.</div>}
              </div>
            </div>
          )
        }

        {/* Course Chapter Tab */}
        {
          activeTab === 'course-chapter' && (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Chapter Title"
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  style={{ flex: 1, padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px' }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && newChapter) { handleAddItem('chapters', { title: newChapter }); setNewChapter(''); } }}
                />
                <button onClick={() => {
                  if (newChapter) { handleAddItem('chapters', { title: newChapter }); setNewChapter(''); }
                }} style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add Chapter</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {parseArrayField(formData.chapters).map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'white', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    <div style={{ fontWeight: 500 }}>Chapter {i + 1}: {item.title}</div>
                    <button onClick={() => handleRemoveItem('chapters', i)} style={{ color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                ))}
                {parseArrayField(formData.chapters).length === 0 && <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>No chapters added yet.</div>}
              </div>
            </div>
          )
        }

        {/* Related Course Tab */}
        {
          activeTab === 'related-course' && (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <select id="relatedCourseSelect" style={{ flex: 1, padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px' }}>
                  <option value="">Select a course to relate</option>
                  {filteredCourses.filter(c => c.id !== formData.id && !parseArrayField(formData.relatedCourses).some(rc => rc.id === c.id)).map(c => (
                    <option key={c.id} value={JSON.stringify({ id: c.id, title: c.title })}>{c.title}</option>
                  ))}
                </select>
                <button onClick={() => {
                  const select = document.getElementById('relatedCourseSelect');
                  if (select.value) { handleAddItem('relatedCourses', JSON.parse(select.value)); select.value = ''; }
                }} style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {parseArrayField(formData.relatedCourses).map((item, i) => (
                  <div key={i} style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.title}</span>
                    <button onClick={() => handleRemoveItem('relatedCourses', i)} style={{ color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer' }}><X size={16} /></button>
                  </div>
                ))}
              </div>
              {parseArrayField(formData.relatedCourses).length === 0 && <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>No related courses selected.</div>}
            </div>
          )
        }

        {/* Question Tab */}
        {
          activeTab === 'question' && (
            <div>
              <div style={{ display: 'grid', gap: '12px', marginBottom: '20px', padding: '16px', background: '#F9FAFB', borderRadius: '8px' }}>
                <input
                  type="text"
                  placeholder="Question"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px' }}
                />
                <textarea
                  placeholder="Answer"
                  rows="3"
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontFamily: 'inherit' }}
                ></textarea>
                <button onClick={() => {
                  if (newFaq.question && newFaq.answer) {
                    handleAddItem('faqs', newFaq);
                    setNewFaq({ question: '', answer: '' });
                  }
                }} style={{ justifySelf: 'start', padding: '8px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add FAQ</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {parseArrayField(formData.faqs).map((item, i) => (
                  <div key={i} style={{ padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontWeight: 600, color: '#111827' }}>Q: {item.question}</div>
                      <button onClick={() => handleRemoveItem('faqs', i)} style={{ color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    <div style={{ color: '#4B5563' }}>A: {item.answer}</div>
                  </div>
                ))}
                {parseArrayField(formData.faqs).length === 0 && <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>No FAQs added yet.</div>}
              </div>
            </div>
          )
        }

        {/* Review Rating Tab */}
        {
          activeTab === 'review-rating' && (
            <div>
              <div style={{ display: 'grid', gap: '12px', marginBottom: '20px', padding: '16px', background: '#F9FAFB', borderRadius: '8px' }}>
                <div style={{ textAlign: 'center', color: '#6B7280', fontStyle: 'italic', marginBottom: '10px' }}>
                  Note: Usually reviews are submitted by users. You can manually add testimonials here.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="User Name"
                    value={newReview.user}
                    onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                    style={{ padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px' }}
                  />
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                    style={{ padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px' }}
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <textarea
                  placeholder="Review Comment"
                  rows="3"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontFamily: 'inherit' }}
                ></textarea>
                <button onClick={() => {
                  if (newReview.user && newReview.comment) {
                    handleAddItem('reviews', { ...newReview, date: new Date().toISOString().split('T')[0] });
                    setNewReview({ user: '', rating: '5', comment: '' });
                  }
                }} style={{ justifySelf: 'start', padding: '8px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add Review</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {parseArrayField(formData.reviews).map((item, i) => (
                  <div key={i} style={{ padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontWeight: 600 }}>{item.user}</div>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#F59E0B', fontSize: '0.9rem' }}>
                          {item.rating} ★
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{item.date}</div>
                      </div>
                      <button onClick={() => handleRemoveItem('reviews', i)} style={{ color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    <div style={{ color: '#4B5563' }}>{item.comment}</div>
                  </div>
                ))}
                {parseArrayField(formData.reviews).length === 0 && <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>No reviews added yet.</div>}
              </div>
            </div>
          )
        }

        {/* Study Material Tab */}
        {
          activeTab === 'study-material' && (
            <div>
              <div style={{ display: 'grid', gap: '12px', marginBottom: '20px', padding: '16px', background: '#F9FAFB', borderRadius: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Title (e.g. Course Syllabus)"
                    id="newMaterialTitle"
                    style={{ padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px' }}
                  />
                  <select id="newMaterialType" style={{ padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px' }}>
                    <option value="pdf">PDF</option>
                    <option value="link">External Link</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="URL / Link"
                    id="newMaterialUrl"
                    style={{ flex: 1, padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px' }}
                  />
                  <label style={{ cursor: 'pointer', padding: '0 16px', height: '38px', backgroundColor: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                    {uploading ? (
                      <span style={{ fontSize: '0.85rem' }}>⏳...</span>
                    ) : (
                      <>
                        <span style={{ fontSize: '0.9rem' }}>Upload</span>
                        <input
                          type="file"
                          style={{ display: 'none' }}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setUploading(true);
                              try {
                                const res = await mediaService.uploadFile(file, 'study_material');
                                if (res && (res.success || res.status === 'success' || res.data?.url)) {
                                  const fileUrl = res.data?.url || res.url;
                                  const urlInput = document.getElementById('newMaterialUrl');
                                  if (urlInput) {
                                    urlInput.value = fileUrl;
                                    // Trigger change event if needed, but here we read value on button click
                                  }
                                  if (file.type === 'application/pdf') {
                                    document.getElementById('newMaterialType').value = 'pdf';
                                  }
                                }
                              } catch (err) {
                                console.error("Upload failed", err);
                                alert("Upload failed. Please try again.");
                              } finally {
                                setUploading(false);
                              }
                            }
                          }}
                        />
                      </>
                    )}
                  </label>
                </div>
                <button disabled={uploading} onClick={() => {
                  const titleInput = document.getElementById('newMaterialTitle');
                  const typeInput = document.getElementById('newMaterialType');
                  const urlInput = document.getElementById('newMaterialUrl');
                  if (titleInput.value && urlInput.value) {
                    handleAddItem('studyMaterial', {
                      title: titleInput.value,
                      type: typeInput.value,
                      url: urlInput.value
                    });
                    titleInput.value = '';
                    urlInput.value = '';
                    typeInput.value = 'pdf';
                  }
                }} style={{ justifySelf: 'start', padding: '8px 20px', backgroundColor: uploading ? '#9CA3AF' : 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: uploading ? 'not-allowed' : 'pointer' }}>Add Material</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {parseArrayField(formData.studyMaterial).map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'white', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FileText size={20} color="var(--color-primary)" />
                      <div>
                        <div style={{ fontWeight: 500 }}>{item.title}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                          <span style={{ textTransform: 'uppercase', fontSize: '0.7rem', padding: '2px 6px', background: '#E5E7EB', borderRadius: '4px', marginRight: '8px' }}>{item.type}</span>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6', textDecoration: 'none' }}>View</a>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveItem('studyMaterial', i)} style={{ color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                ))}
                {parseArrayField(formData.studyMaterial).length === 0 && <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>No study material added yet.</div>}
              </div>
            </div>
          )
        }
      </div >
    </div >
  );
};

export default CourseManagement;
