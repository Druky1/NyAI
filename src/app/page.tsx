import FileUpload from "@/components/ui/FileUpload";
import SubscriptionButton from "@/components/ui/SubscriptionButton";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { checkSubscription } from "@/lib/subscription";
import { UserButton, auth } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import {db} from '@/lib/db';
import {chats} from '@/lib/db/schema';
import {eq} from 'drizzle-orm';


export default async function Home() {

  const { userId } = await auth()
  const isAuth = !!userId
  const isPro = await checkSubscription()
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId))
    if (firstChat){
      firstChat = firstChat[0]
    }
  }
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with your{' '}
              <span className='text-violet-600'>Legal Documents</span>{' '}
              in seconds!</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex mt-5">
            {isAuth && firstChat &&
            <Link href={`/chat/${firstChat.id}`}>
              <Button>Go to Dashboard<ArrowRight className="ml-2 size-sm"/></Button>
            </Link>}
            <div className="ml-3 ">
              <SubscriptionButton isPro={isPro}/>
            </div>
          </div>
          <p className="max-w-xl mt-3 mb-3 text-lg text-slate-600">
            From rental agreements to wills, NyAI brings your documents to life.
            You can ask questions, get summaries, find information, and much more.
          </p>

          <div className="w-full mt-3">
            {isAuth ? (
              <FileUpload />
            ) :
              (
                <Link
                  className={buttonVariants({
                    size: "default",
                    className: "mt-5",
                  })}
                  href="./sign-in">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
