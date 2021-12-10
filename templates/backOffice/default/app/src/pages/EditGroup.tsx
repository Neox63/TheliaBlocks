import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Prompt } from "react-router-dom";
import { toast } from 'react-toastify';

import { RootState } from '../redux/store';
import { setUnsaved } from '../redux/ui';
import { useCreateOrUpdateGroup, useGroup } from '../hooks/data';
import Menu from '../components/Menu';
import Group from '../components/Group';
import Loader from '../components/Loader';

export default function EditGroup({ id }: { id?: number }) {
  const windowConstants = useSelector(
    (state: RootState) => state.ui.windowConstants
  );
  const [initialGroupId] = useState(id || windowConstants.groupId);
  const { isLoading, isFetchedAfterMount, isIdle } = useGroup({
    id: initialGroupId
  });
  const dispatch = useDispatch();
  const group = useSelector((state: RootState) => state.group);
  const blocks = useSelector((state: RootState) => state.blocks);

  const mutation = useCreateOrUpdateGroup({
    id: group.id
  });

  useEffect(() => {
    dispatch(setUnsaved(true));
  }, [group, blocks]);

  const onSave = () => {
    mutation.mutate({ group, blocks });

    if (mutation.isError) {
      toast.error(
        `Une erreur est survenue, veuillez nous contacter. ${
          (mutation.error as any)?.message
            ? `(${(mutation.error as any).message})`
            : ''
        }`
      );

      return;
    }

    if (!mutation.isSuccess) return;

    toast.success('Le groupe a bien été sauvegardé');
  };

  if (!isIdle && (!isFetchedAfterMount || isLoading)) {
    return <Loader width="80px" />;
  }

  return (
    <>
      {/* <Prompt
        when={isUnsaved}
        message="Are you sure you want to leave?"
      /> */}
      <Group onSave={onSave} />
      <Menu />
    </>
  );
}
