import { env } from '@/env'
import axios from 'axios'

interface SearchParameters {
  q: string
  type: string
  engine: string
}

interface AnswerBox {
  title: string
  answer: string
}

interface KnowledgeGraph {
  title: string
  type: string
  website: string
  imageUrl: string
  description: string
  descriptionSource: string
  descriptionLink: string
  attributes: {
    [x: string]: unknown
  }
}

interface Organic {
  title: string
  link: string
  snippet: string
  sitelinks: {
    title: string
    link: string
  }[]
}

interface Place {
  title: string
  address: string
  cid: string
}

interface TopStory {
  title: string
  link: string
  source: string
  date: string
  imageUrl: string
}

interface PeopleAlsoAsk {
  question: string
  snippet: string
  title: string
  link: string
}

interface RelatedSearch {
  query: string
}

interface SearchResults {
  searchParameters: SearchParameters
  answerBox: AnswerBox
  knowledgeGraph: KnowledgeGraph
  organic: Organic[]
  places: Place[]
  topStories: TopStory[]
  peopleAlsoAsk: PeopleAlsoAsk[]
  relatedSearches: RelatedSearch[]
}

type SearchSerperParams = {
  input: string
  locale: string
}
export const searchSerper = async (
  params: SearchSerperParams,
): Promise<SearchResults> => {
  const data = JSON.stringify({
    q: params.input,
    hl: params.locale,
  })

  const config = {
    method: 'post',
    url: 'https://google.serper.dev/search',
    headers: {
      'X-API-KEY': env.SERPER_API_KEY,
      'Content-Type': 'application/json',
    },
    data,
  }

  const response = await axios(config)

  return response.data as SearchResults
}
