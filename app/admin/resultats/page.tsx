import { redirect } from 'next/navigation';

export const instant = false;

export const metadata = {
  title: 'Résultats Admin - Question pour un DevAs',
  description: 'Gérez les résultats et scores',
};

export default function AdminResultatsPage() {
  // Redirect to admin matchs page which shows results
  redirect('/matchs');
}
