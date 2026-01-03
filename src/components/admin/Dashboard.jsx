import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { FolderKanban, Wrench, Briefcase, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    workExperience: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, skillsRes, workRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('skills').select('id', { count: 'exact', head: true }),
        supabase.from('work_experience').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        projects: projectsRes.count || 0,
        skills: skillsRes.count || 0,
        workExperience: workRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Projects',
      count: stats.projects,
      icon: FolderKanban,
      link: '/admin/projects',
      color: 'bg-blue-500',
    },
    {
      title: 'Skills',
      count: stats.skills,
      icon: Wrench,
      link: '/admin/skills',
      color: 'bg-green-500',
    },
    {
      title: 'Work Experience',
      count: stats.workExperience,
      icon: Briefcase,
      link: '/admin/work',
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-arsenica mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back! Here's an overview of your portfolio.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white p-6 rounded-lg border-2 border-black hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-base mb-1">{card.title}</p>
                <p className="text-4xl font-bold">{card.count}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg border-2 border-black">
        <h2 className="text-2xl font-arsenica mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/projects"
            className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-center text-base font-medium"
          >
            + Add Project
          </Link>
          <Link
            to="/admin/skills"
            className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-center text-base font-medium"
          >
            + Add Skill
          </Link>
          <Link
            to="/admin/work"
            className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-center text-base font-medium"
          >
            + Add Work
          </Link>
        </div>
      </div>
    </div>
  );
}
