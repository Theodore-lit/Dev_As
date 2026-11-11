import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Résultats - Question pour un DevAs',
  description: 'Consultez les résultats et scores',
};

export default function ResultatsPage() {
  // Redirect to matchs page which shows results
  redirect('/matchs');
}
