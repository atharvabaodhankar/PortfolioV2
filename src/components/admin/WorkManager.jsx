import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit2, Trash2, X, Briefcase } from 'lucide-react';

export default function WorkManager() {
  const [workExperience, setWorkExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
    display_order: 0,
  });

  useEffect(() => {
    fetchWork();
  }, []);

  const fetchWork = async () => {
    try {
      const { data, error } = await supabase
        .from('work_experience')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setWorkExperience(data || []);
    } catch (error) {
      console.error('Error fetching work experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('work_experience')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('work_experience')
          .insert([formData]);
        if (error) throw error;
      }

      resetForm();
      fetchWork();
    } catch (error) {
      alert('Error saving work experience: ' + error.message);
    }
  };

  const handleEdit = (work) => {
    setFormData(work);
    setEditingId(work.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this work experience?')) return;

    try {
      const { error } = await supabase
        .from('work_experience')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchWork();
    } catch (error) {
      alert('Error deleting work experience: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      description: '',
      start_date: '',
      end_date: '',
      is_current: false,
      display_order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-arsenica mb-2">Work Experience</h1>
          <p className="text-lg text-gray-600">Manage your work history</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Experience
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-arsenica">
                {editingId ? 'Edit Experience' : 'Add New Experience'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-base font-medium mb-1">Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-1">Position *</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    disabled={formData.is_current}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({ ...formData, is_current: e.target.checked, end_date: e.target.checked ? '' : formData.end_date })}
                  className="w-4 h-4"
                />
                <label htmlFor="current" className="text-base">Currently working here</label>
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

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Save Experience
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Work List */}
      <div className="space-y-4">
        {workExperience.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-gray-200">
            <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No work experience yet</h3>
            <p className="text-gray-500 mb-4">Add your first work experience</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Add Experience
            </button>
          </div>
        ) : (
          workExperience.map((work) => (
            <div key={work.id} className="bg-white p-6 rounded-lg border-2 border-black">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-1">{work.position}</h3>
                  <p className="text-lg text-gray-600 mb-2">{work.company}</p>
                  {work.description && (
                    <p className="text-base text-gray-700 mb-3">{work.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {work.start_date && new Date(work.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {' - '}
                    {work.is_current ? 'Present' : work.end_date ? new Date(work.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(work)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(work.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
