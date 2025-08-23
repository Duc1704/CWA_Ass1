import { STUDENT_NAME, STUDENT_NUMBER } from '../layout';

export default function Footer(): JSX.Element {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-[--foreground]/70 border-t border-[--foreground]/20 bg-[--background] z-10">
      <p className="text-sm">
        © 2025 {STUDENT_NAME} - Student No: {STUDENT_NUMBER} | Date: 23/08/2025
      </p>
    </footer>
  );
}
