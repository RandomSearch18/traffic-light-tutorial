function onFormSubmit(event: SubmitEvent) {
  event.preventDefault()

  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  console.log(formData)
}

function setupForm() {
  const form = document.querySelector<HTMLFormElement>("form.data-collection")!
  form.addEventListener("submit", onFormSubmit)
}

setupForm()
