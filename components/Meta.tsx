import Head from 'next/head';

interface Props {
  title?: string;
  url?: string;
  description?: string;
}

const Meta: React.FC<Props> = (customMeta) => {
  const meta = {
    title: 'Sooneos - Get Your lyrics automaticaly',
    description:
      'Welcome to Sooneos. Login with your spotify account and get your lyrics in real time !',
    image:
      '',
    type: 'website',
    ...customMeta,
  };

  return (
    <Head>
      <title>{meta.title}</title>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
      />
      <meta name="description" content={meta.description} />
      <meta name="og:title" content={meta.title} />
      <meta
        property="og:url"
        content={`https://sooneos.me`}
      />
      <link
        rel="canonical"
        href={`https://sooneos.me`}
      />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content="Sooneos" />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:image" content={meta.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@mikhael_bailly" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
    </Head>
  );
};

export default Meta;
