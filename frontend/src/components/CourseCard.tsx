import { Link } from "react-router-dom";
import { Star, Users } from "lucide-react";
import { type Course } from "../types";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="card hover:shadow-xl transition-shadow"
    >
      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <h3 className="font-bold text-xl mb-2 line-clamp-2">{course.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {course.description}
      </p>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
        <span className="font-medium">{course.instructor.name}</span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{course.averageRating.toFixed(1)}</span>
        </div>

        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{course.totalStudents}</span>
        </div>

        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
          {course.level}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-2xl font-bold text-primary-600">
          ${course.price.toFixed(2)}
        </span>
        <button className="btn-primary text-sm">View Details</button>
      </div>
    </Link>
  );
};
