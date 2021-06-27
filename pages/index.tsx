import { CustomPage } from '@/models/CustomPage';
import HomePage from '@/components/home/HomePage';
import withAuthentication from 'hoc/WithAuthentication';
import HomeLayout from '@/layouts/HomeLayout';

const Home: CustomPage = () => {
  return (
    <HomeLayout>
      <HomePage />
    </HomeLayout>
  );
};

export default withAuthentication(Home);
