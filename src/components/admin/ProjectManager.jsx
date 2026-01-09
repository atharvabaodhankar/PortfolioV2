import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { uploadFile, deleteFile } from '../../lib/storageUtils';
import { Plus, Edit2, Trash2, Save, X, Upload, ExternalLink, FolderKanban } from 'lucide-react';

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    link: '',
    image_url: '',
    category: '',
    display_order: 0,
    is_featured: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `projects/${Date.now()}_${file.name}`;
      const { url, error } = await uploadFile(file, fileName);

      if (error) throw error;

      setFormData({ ...formData, image_url: url });
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([formData]);

        if (error) throw error;
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      alert('Error saving project: ' + error.message);
    }
  };

  const handleEdit = (project) => {
    setFormData(project);
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id, imageUrl) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      // Delete from database
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Optionally delete image from storage
      if (imageUrl && imageUrl.includes('supabase.co')) {
        const path = imageUrl.split('/').slice(-2).join('/');
        await deleteFile(path);
      }

      fetchProjects();
    } catch (error) {
      alert('Error deleting project: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      link: '',
      image_url: '',
      category: '',
      display_order: 0,
      is_featured: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-lg">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-arsenica mb-2">Projects</h1>
          <p className="text-lg text-gray-600">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-arsenica">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-base font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-base font-medium mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-base font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-base font-medium mb-1">Project Link</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-base font-medium mb-1">Project Image</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors w-fit">
                    <Upload className="w-5 h-5" />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {formData.image_url && (
                    <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Category & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                    placeholder="Web, Mobile, etc."
                  />
                </div>
                <div>
                  <label className="block text-base font-medium mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-base">Featured Project</label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Save Project
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg border-2 border-black overflow-hidden">
            {project.image_url && (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-bold mb-1">{project.title}</h3>
              {project.subtitle && (
                <p className="text-gray-600 text-sm mb-2">{project.subtitle}</p>
              )}
              {project.description && (
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{project.description}</p>
              )}
              
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id, project.image_url)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-600 hover:text-black" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-gray-200">
          <FolderKanban className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first project</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add Your First Project
          </button>
        </div>
      )}
    </div>
  );
}
