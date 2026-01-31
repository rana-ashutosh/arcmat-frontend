import Logo from '../../../components/ui/logo';
import LoginForm from '@/components/auth/LoginForm';
import Image from 'next/image';
import sample from '../../../public/login-register/Sample-Box.png';

export const metadata = {
  title: 'Sign In - arcmat',
  description: 'Sign in to your arcmat account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#F5E9E2]">

      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-between p-2 relative">
        <div className="w-full pl-4 pt-2">
          <Logo href="/"/>
        </div>

        <div className="flex flex-col items-center justify-start flex-1 mt-10 py-8 px-8">
          <h1 className="text-[36px] font-semibold text-[#4D4E58] text-center leading-[50px] max-w-[500px] mb-6">
            The marketplace where architects and brands build the future together.
          </h1>

          <p className="text-[16px] text-[#86868B] text-center leading-[24px] mb-8">
            Hundreds of Brands. One Website. Order by Midnight.
          </p>

          <div className="mb-8">
            <Image
              src={sample}
              alt="Architects and brands illustration"
              width={300}
              height={200}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>


      <div className="min-h-screen flex w-full lg:w-1/2 bg-white px-8 sm:px-8 justify-center bg-red-500">
        <LoginForm />
      </div>

    </div>
  );
}