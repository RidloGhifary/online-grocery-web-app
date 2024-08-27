export default function UserDetail() {
  const userDatas = [
    {
      title: "User Biodata",
      content: [
        {
          name: "Name",
          value: "Ridlo achmad ghifary",
        },
        {
          name: "Gender",
          value: "Male",
        },
      ],
    },
    {
      title: "User Credentials",
      content: [
        {
          name: "Email",
          value: "ridloachd@gmail.com",
        },
        {
          name: "Phone",
          value: "08123456789",
        },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {userDatas.map((data) => (
        <div key={data.title} className="space-y-4">
          <h2 className="font-bold">{data.title}</h2>
          <div className="space-y-2">
            {data.content.map((content) => (
              <div key={content.name} className="flex items-center gap-4">
                <p className="w-[100px] text-sm font-semibold md:text-base">
                  {content.name}
                </p>
                <p className="text-sm md:text-base">{content.value}</p>
                <button className="btn btn-link btn-sm">change</button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button className="btn btn-secondary btn-sm md:btn-md">
        Change Password
      </button>
    </div>
  );
}
