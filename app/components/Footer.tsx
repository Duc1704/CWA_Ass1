import { STUDENT_NAME, STUDENT_NUMBER } from '../constants';

export default function Footer(): JSX.Element {
  return (
    <footer className="py-4 text-center text-[--foreground]/70 border-t border-[--foreground]/20 bg-[--background]">
      <p className="text-sm">
        © Copyright 2025 {STUDENT_NAME} - Student No: {STUDENT_NUMBER} | Date: 23/08/2025
      </p>
    </footer>
  );
}
