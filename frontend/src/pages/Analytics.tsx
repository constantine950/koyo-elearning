import { useQuery } from "@apollo/client/react";
import { GET_INSTRUCTOR_ANALYTICS } from "../graphql/queries";
import { Navbar } from "../components/Navbar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Star,
  Award,
} from "lucide-react";
import { type InstructorAnalytics } from "../types/analytics";

interface AnalyticsData {
  getInstructorAnalytics: InstructorAnalytics;
}

const Analytics = () => {
  const { data, loading } = useQuery<AnalyticsData>(GET_INSTRUCTOR_ANALYTICS);

  const analytics = data?.getInstructorAnalytics;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card h-32 bg-gray-300"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-gray-500">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your performance and growth</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Students</p>
            <p className="text-3xl font-bold">{analytics.totalStudents}</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">
              ${analytics.totalRevenue.toFixed(2)}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Courses</p>
            <p className="text-3xl font-bold">{analytics.totalCourses}</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Average Rating</p>
            <p className="text-3xl font-bold">
              {analytics.averageRating.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">
              {analytics.totalReviews} reviews
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Enrollments Chart */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Monthly Enrollments</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyEnrollments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const [year, month] = value.split("-");
                    return `${month}/${year.slice(2)}`;
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0284c7"
                  strokeWidth={2}
                  name="Enrollments"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Courses Chart */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6">
              Top Courses by Enrollment
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topCourses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="course.title"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="enrollmentCount" fill="#0284c7" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Courses List */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-bold">Top Performing Courses</h3>
          </div>

          <div className="space-y-4">
            {analytics.topCourses.map((topCourse, index) => (
              <div
                key={topCourse.course.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                    #{index + 1}
                  </div>

                  {topCourse.course.thumbnail && (
                    <img
                      src={topCourse.course.thumbnail}
                      alt={topCourse.course.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}

                  <div>
                    <h4 className="font-medium">{topCourse.course.title}</h4>
                    <p className="text-sm text-gray-500">
                      {topCourse.enrollmentCount} students enrolled
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">
                    ${topCourse.revenue.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Total Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
