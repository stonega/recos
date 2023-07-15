import { NextApiRequest, NextApiResponse } from "next";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client";

const httpLink = new HttpLink({ uri: "https://api.podchaser.com/graphql" });
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = process.env.PODCHASER_ACCESS_TOKEN;
  operation.setContext({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return forward(operation);
});

const apolloAuthClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { search, page } = req.query;
    if (search) {
      const query = `query($searchTerm: String!, $page: Int) {
        episodes (
            searchTerm: $searchTerm,
            page: $page
        ) { 
          paginatorInfo {
              currentPage,
              hasMorePages,
              lastPage,
          },
          data {
            id,
            title,
            description,
            length,
            imageUrl,
            audioUrl,
            podcast {
              title,
              imageUrl
            }
          }
        }
    }`;

      const searchPodcast = (searchTerm: string, page = "1") => {
        return apolloAuthClient.query({
          query: gql(query),
          variables: {
            searchTerm,
            page: Number(page),
          },
        });
      };

      try {
        const response = await searchPodcast(search as string, page as string);
        console.log(response.data);
        res.status(200).json(response.data);
      } catch (e) {
        console.log(e);
      }
    }
  } else {
    res.status(404).json({ data: "not found" });
  }
}
