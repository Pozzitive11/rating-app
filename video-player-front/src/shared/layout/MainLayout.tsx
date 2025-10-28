import { BackNavigation } from "../ui";

const MainLayout = ({
  children,
  backNavigationText,
}: {
  children: React.ReactNode;
  backNavigationText: string;
}) => {
  return (
    <>
      <BackNavigation text={backNavigationText} />
      {children}
    </>
  );
};

export default MainLayout;
