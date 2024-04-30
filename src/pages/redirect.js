const Redirect = () => {
  window.onload = function () {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (code) {
      window.opener.postMessage({ type: 'authorization_code', code: code }, window.location.origin);

      setTimeout(() => {
        window.close();
      }, 3000);
    }
  };

  return (
    <p>Redirecting...</p>
  );
};

export default Redirect;
