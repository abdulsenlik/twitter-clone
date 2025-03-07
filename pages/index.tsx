import Form from "@/components/Form"
import Header from "@/components/Header"
import PostFeed from "@/components/posts/PostFeed"

export default function Home() {
  return (
    <div className = "text-3xl text-sky-500">
      <>
        <Header label= "Home" />
        <Form  placeholder="What's happening?"/>
        <PostFeed />
      </>
    </div>
  )
}
