import Hero from '../components/home/Hero';
import LatestNews from '../components/home/LatestNews';
import FixturesWidget from '../components/home/FixturesWidget';
import LeagueTable from '../components/home/LeagueTable';
import GalleryPreview from '../components/home/GalleryPreview';
import FeaturedVideos from '../components/home/FeaturedVideos';

export default function Home() {
  return (
    <>
      <Hero />
      <LatestNews />
      <FixturesWidget />
      <LeagueTable />
      <GalleryPreview />
      <FeaturedVideos />
    </>
  );
}
