import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { SkeletonStory } from "../ui/skeleton";
import { getMineStories, StoryTitle } from "@/api/login";
import { useLocalToken } from "@/hooks/localStorage";
import { DraftsLi, PublishedLi } from "../Li";


export function MeStories() {
  return (
    <div className="lg:pl-28 lg:pt-14">
      <div className="text-5xl font-semibold">Your Stories</div>
      <div className="pt-12">
        <Stories />
      </div>
    </div>
  )
}

function Stories() {
  let token = useLocalToken();
  let { data, isLoading, isError } = useQuery({
    queryKey: ['mineStories'],
    queryFn: async () => getMineStories(token)
  })

  if (isLoading) {
    return <SkeletonStory />
  }

  if (isError) {
    return <div>Error...</div>
  }

  return (
    <Tabs defaultValue="drafts" className="lg:max-w-2xl">
      <TabsList className="bg-transparent">
        <TabsTrigger className="px-14 text-lg transition-all" value="drafts">Drafts</TabsTrigger>
        <TabsTrigger className="px-14 text-lg transition-all" value="published">Published</TabsTrigger>
      </TabsList>
      <div className="pt-8">
        <TabsContent value="drafts"><Drafts key={'draft'} data={data?.data ?? []} /></TabsContent>
        <TabsContent value="published"><Published key={'published'} data={data?.data ?? []} /></TabsContent>
      </div>
    </Tabs>

  )
}

function Drafts(props: { data: Array<StoryTitle> }) {
  let content: Array<any> = [];

  props.data.forEach(i => {
    if (i.isPublished === false) {
      content.push(
        <DraftsLi data={i} key={i.key} />
      )
    }
  })

  if (!content.length) {
    return <div className="lg:pl-12 font-medium tracking-wider text-muted-foreground select-none">You have no drafts saved.</div>
  }

  return (
    <ul className="space-y-2">
      {
        content
      }
    </ul>
  )
}

function Published(props: { data: Array<StoryTitle> }) {
  let content: Array<any> = [];
  props.data.forEach(i => {
    if (i.isPublished === true) {
      content.push(
        <PublishedLi key={i.key} data={i} />
      )
    }
  })

  if (!content.length) {
    return <div className="lg:pl-12 font-medium tracking-wider text-muted-foreground select-none">You have no story published.</div>
  }


  return (
    <ul className="space-y-2">
      {content}
    </ul>
  )
}

