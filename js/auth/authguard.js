async function authGuard() {
  try {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      console.error(error);
      window.location.href = "index.html";
      return;
    }

    if (data.session === null) {
      window.location.href = "index.html";
      return;
    }
  } catch (error) {
    console.error(error);
    window.location.href = "index.html";
  }
}

authGuard();