export const getListHref = (id: string) =>
  ({
    params: { id },
    pathname: "/list/[id]",
  }) as never;
