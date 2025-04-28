import { useLoading } from './Context/LoadingContext';
import { HashLoader } from 'react-spinners';

function GlobalLoading() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 opacity-90 bg-black bg-opacity-40 flex flex-col justify-center items-center z-1000  animate-fade-in">
      <HashLoader
        size={100}
        color="#F7F7F7"
        ariaLabel="loading..."
      />
    </div>
  );
}

export default GlobalLoading;