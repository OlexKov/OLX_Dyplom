import AdvertsSection from '../../../components/adverts_section';
import HomePageImageBlock from '../../../components/home_page_image';
import PrimaryButton from '../../../components/buttons/primary_button';
import { useGetAdvertPageQuery } from '../../../redux/api/advertApi';
import './style.scss'
import { useEffect, useState } from 'react';
import { IAdvert } from '../../../models/advert';


const HomePage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isEnd, setisEnd] = useState(false);
  const { data, isLoading } = useGetAdvertPageQuery({
    page,
    size: 4,
    sortKey: "date",
    isDescending: true,
    priceFrom: 0,
    priceTo: 99999999999,
    isContractPrice: false,
    approved: false,
    blocked: false,
    archived: false
  });

  const [adverts, setAdverts] = useState<IAdvert[]>([]);
  useEffect(() => {
    if (data?.items) {
      if (data.total == adverts.length) {
        setisEnd(true); 
      } else {
        setAdverts((prev) => [...prev, ...data.items]);
      }
    }
  }, [data]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="flex-1 flex flex-col justify-center">
      <HomePageImageBlock />
      <div className='flex flex-col items-center px-[50px] py-[50px] gap-[50px]'>
        <AdvertsSection title='Рекомендовані оголошення' adverts={adverts} isLoading={isLoading} />
        <PrimaryButton onButtonClick={loadMore} title='Завантажити більше' disabled={isEnd} isLoading={false} className='w-[420px] h-[60px] p-[8px]' bgColor='#9B7A5B' fontColor='white' brColor='#9B7A5B' />
      </div>
    </div>
  );
};

export default HomePage;