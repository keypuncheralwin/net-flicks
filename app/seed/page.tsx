'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RotateCw } from 'lucide-react';

export default function SeedDatabase() {
  const [movieId, setMovieId] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    // Construct the URL with parameters
    const url = new URL('/api/featured/update', window.location.origin);
    url.searchParams.append('movieId', movieId);
    url.searchParams.append('mediaType', mediaType);

    // Make a POST request to your API route with URL parameters
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      await response.json();
      toast({
        title: 'Sucess!',
        description: 'Succesfully added',
      });
      setIsLoading(false);
    } else {
      console.error('Failed to update the database');
      toast({
        title: 'Error',
        description: 'Failed to update the database',
        variant: 'destructive',
      });
    }
  };

  return (
    // Center the form on the page with Flexbox
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl font-semibold p-2 mb-5">
        Update the featured movies list
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="mb-4">
          <label
            htmlFor="movieId"
            className="block mb-2 text-sm font-medium text-white"
          >
            Movie ID
          </label>
          <input
            type="text"
            id="movieId"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter movie ID"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="mediaType"
            className="block mb-2 text-sm font-medium text-white"
          >
            Media Type
          </label>
          <input
            type="text"
            id="mediaType"
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter media type"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-[#e50914] text-white">
          {isLoading ? <RotateCw className="animate-spin" /> : 'Submit'}
        </Button>
      </form>
    </div>
  );
}
