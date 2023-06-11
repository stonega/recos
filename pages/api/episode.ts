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
    const { search } = req.query;
    if (search) {
      const query = `query($searchTerm: String!) {
        episodes (
            searchTerm: $searchTerm,
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

      const searchPodcast = (searchTerm: string) => {
        return apolloAuthClient.query({
          query: gql(query),
          variables: {
            searchTerm,
          },
        });
      };

      try {
        const response = await searchPodcast(search as string);
        console.log(response);
        res.status(200).json(response.data);
      } catch (e) {
        console.log(e);
      }
    }
  } else {
    res.status(404).json({ data: "not found" });
  }
}
