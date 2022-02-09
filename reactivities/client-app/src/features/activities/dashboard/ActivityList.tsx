import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

import ActivityListItem from "./ActivityListItem";

import agent from "../../../app/api/agent";

// useQuery hook to fetch data from the server
// prefetchQuery hook is a method of 'QueryClient' &
// we can get that QueryClient with useQueryClient hook
import { useQuery, useQueryClient } from "react-query";

import Loading from "../../../app/layout/Loading";
import { Button } from "semantic-ui-react";

const style = {
  display: "flex",
  justifyContent: "space-between",
};

const ActivityList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // pre-fetching data & storing in the cache
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(["kam-posts", currentPage], () => agent.Activities.list(currentPage), {
    keepPreviousData: true,
  });

  useEffect(() => {
    const nextPage = currentPage + 1;

    queryClient.prefetchQuery(["kam-posts", nextPage], () => agent.Activities.list(nextPage));
  }, [currentPage, queryClient]);

  if (isLoading) return <Loading content="loading posts" />;

  return (
    <>
      {data?.map(activity => (
        <ActivityListItem key={activity.id} activity={activity} />
      ))}

      <section style={style}>
        <Button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(previousState => previousState - 1)}
          primary
          floated="left"
          content="Prev"
        />
        <span>Page {currentPage}</span>
        <Button
          onClick={() => setCurrentPage(previousState => previousState + 1)}
          primary
          floated="right"
          content="Next"
        />
      </section>
    </>
  );
};

export default observer(ActivityList);
