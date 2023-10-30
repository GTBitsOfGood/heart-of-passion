import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { RetreatModel } from "~/server/models/Retreat";
import { trpc } from "~/utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // get the chapter id from the url
  // navigate to the latest retreat from that chapter

  const id = context!.params!.id!;

  // Using RetreatModel, get the latest retreat from the chapter
  const retreat = await RetreatModel.findOne({ chapterId: id })
    .sort({
      startDate: -1,
    })
    .exec();

  return {
    redirect: {
      destination: `/retreat/${retreat?.id}`,
      permanent: false,
    },
  };
};

export default function Chapter({
  repo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <div>This should not be visible</div>;
}
