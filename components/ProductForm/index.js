import { StyledForm, StyledHeading, StyledLabel } from "./ProductForm.styled";
import { StyledButton } from "../Button/Button.styled";
import { mutate } from "swr";
import { useRouter } from "next/router";

export default function ProductForm() {
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);

    //Browser API fetch für einen HTTP-request
    const response = await fetch("/api/products", {
      method: "POST",
      //Browser sagt Server, dass der im body enthaltene Inhalt vom content-Type JSON ist (statt XML...)
      headers: {
        "Content-Type": "application/json",
      },
      //http kennt nur Zeichenketten, daher wird das productData-Object in eine Zeichenkette umgewandelt
      body: JSON.stringify(productData),
    });

    // event.target.elements.name.focus();
    // event.target.reset();

    //swr cached, mit mutate sagt man dem Server, dass sich was geändert hat und er neu abrufen soll
    if (response.ok) {
      mutate("/api/products");

      //redirecting nach submit zur neuen Detailspage
      const product = await response.json();
      console.log(product);
      router.push(`/${product._id}`);
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledHeading>Add a new Fish</StyledHeading>
      <StyledLabel htmlFor="name">
        Name:
        <input type="text" id="name" name="name" />
      </StyledLabel>
      <StyledLabel htmlFor="description">
        Description:
        <input type="text" id="description" name="description" />
      </StyledLabel>
      <StyledLabel htmlFor="price">
        Price:
        <input type="number" id="price" name="price" min="0" />
      </StyledLabel>
      <StyledLabel htmlFor="currency">
        Currency:
        <select id="currency" name="currency">
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>
      </StyledLabel>
      <StyledButton type="submit">Submit</StyledButton>
    </StyledForm>
  );
}
