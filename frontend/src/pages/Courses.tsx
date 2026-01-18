import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_COURSES } from "../graphql/queries";
import { CourseCard } from "../components/CourseCard";
import { Navbar } from "../components/Navbar";
import { Search } from "lucide-react";
import type { Course } from "../types";
import { SkeletonCard } from "../components/SkeletonLoader";

interface GetCoursesResponse {
  getCourses: Course[];
}

const Courses = () => {
  const { data, loading, error } = useQuery<GetCoursesResponse>(GET_COURSES);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState<
    "all" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  >("all");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Error loading courses: {error.message}
          </div>
        </div>
      </div>
    );
  }

  const courses: Course[] = data?.getCourses ?? [];

  const categories = [
    "all",
    ...Array.from(new Set(courses.map((course) => course.category))),
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;

    const matchesLevel =
      selectedLevel === "all" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-linear-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Next Skill
          </h1>
          <p className="text-xl text-primary-100 mb-8">
            Learn from the best instructors and advance your career
          </p>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for courses..."
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters & Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedLevel}
              onChange={(e) =>
                setSelectedLevel(
                  e.target.value as
                    | "all"
                    | "BEGINNER"
                    | "INTERMEDIATE"
                    | "ADVANCED"
                )
              }
            >
              <option value="all">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        {/* Count */}
        <p className="text-gray-600 mb-6">
          Showing {filteredCourses.length}{" "}
          {filteredCourses.length === 1 ? "course" : "courses"}
        </p>

        {/* Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
