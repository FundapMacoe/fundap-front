"use client";
import React, { useState } from "react";
import Image from "next/image";

// Tipado alineado con el backend
const initialFormData = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  mensaje: "",
  type_document: "",
  numero_documento: "",
};

type FormData = typeof initialFormData;

export default function Form() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    // Validación frontend básica
    if (formData.nombre.length > 50) {
      setError("El nombre no puede tener más de 50 caracteres.");
      return;
    }
    if (formData.apellido.length > 50) {
      setError("El apellido no puede tener más de 50 caracteres.");
      return;
    }
    if (formData.email.length > 100) {
      setError("El email no puede tener más de 100 caracteres.");
      return;
    }
    if (formData.telefono.length > 10) {
      setError("El teléfono no puede tener más de 10 dígitos.");
      return;
    }
    if (formData.mensaje.length > 50) {
      setError("El mensaje no puede tener más de 50 caracteres.");
      return;
    }
    if (
      formData.numero_documento.length > 15 ||
      formData.numero_documento.length < 5
    ) {
      setError("El número de documento no puede tener más de 15 caracteres.");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}interesadas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        // Si el backend devuelve un mensaje de error específico
        setError(
          data.mensaje || data.detail || "Error al enviar el formulario"
        );
        alert(data.mensaje || data.detail || "Error al enviar el formulario");
        return;
      }
      setSuccess("Formulario enviado con éxito");
      alert("Formulario enviado con éxito");
      setLoading(false);
      // Reiniciar el formulario
      setFormData(initialFormData);
    } catch {
      setError("Error de red o del servidor");
      alert("Error de red o del servidor");
      setLoading(false);
    }
  };

  return (
    <>
      <section className="w-10/12 mx-auto px-4 mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Rellena nuestro formulario y inscribete para poder contactarte!.
        </h2>
        <p className="text-xl mb-3">
          Si tienes alguna pregunta o necesitas más información, no dudes en
          contactarnos. Estamos aquí para ayudarte a dar el primer paso hacia un
          futuro mejor.
        </p>
        <div className="flex flex-col md:flex-row w-full gap-8 items-start justify-center relative min-h-[500px]">
          {/* Imagen de fondo alineada a la derecha y desenfocada */}
          <div className="absolute inset-0 w-11/12 h-full z-0 flex justify-end ml-40">
            <Image
              src="/inscripcion.png"
              width={1980}
              height={1280}
              alt="Formulario de inscripción"
              className="object-contain md:object-right md:blur-sm md:opacity-80 w-full h-full"
            />
          </div>
          {/* Formulario por encima, alineado a la izquierda y sobresaliendo */}
          <div className="bg-black/30 py-5 px-10 border-gray-300 border-2 rounded-lg shadow-lg w-full md:w-2/3 text-white z-10 relative md:mr-auto md:ml-[-4rem] md:mt-20 mt-10">
            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              <h2 className="text-start text-3xl font-extrabold text-white">
                ¿Desea ser contactada?
              </h2>
              <p className="text-start text-2xl mb-4 font-bold text-white">
                Para ser contactada, rellene por favor el siguente formulario.
              </p>
              <div className="mb-4 flex grid-cols-2 gap-4 w-11/12">
                <div className="w-9/12">
                  <label
                    htmlFor="nombre"
                    className="block text-lg text-start font-medium mb-2"
                  >
                    Nombres:
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingrese sus nombres"
                    required
                    maxLength={50}
                    className="w-full text-black outline-none p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="w-9/12">
                  <label
                    htmlFor="apellido"
                    className="block text-start text-lg font-medium mb-2"
                  >
                    Apellidos:
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Ingrese sus apellidos"
                    required
                    maxLength={50}
                    className="w-full outline-none p-2 border border-gray-300 text-black rounded-lg"
                  />
                </div>
              </div>
              <div className="mb-4 flex grid-cols-2 gap-4 w-11/12">
                <div className="w-4/6">
                  <label
                    htmlFor="type_document"
                    className="block text-start text-lg font-medium mb-2"
                  >
                    Tipo de documento:
                  </label>
                  <select
                    id="type_document"
                    name="type_document"
                    value={formData.type_document}
                    onChange={handleChange}
                    className="w-full outline-none p-2 text-black border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="" disabled>
                      Seleccione un tipo de documento
                    </option>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PP">Pasaporte</option>
                    <option value="RC">Registro Civil</option>
                    <option value="NIT">NIT</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="numero_documento"
                    className="block text-start text-lg font-medium mb-2"
                  >
                    Número de documento:
                  </label>
                  <input
                    type="text"
                    id="numero_documento"
                    name="numero_documento"
                    value={formData.numero_documento}
                    onChange={handleChange}
                    pattern="\d{5,15}"
                    title="El número de documento debe tener entre 5 y 15 dígitos."
                    maxLength={15}
                    placeholder="Ingrese su número de documento"
                    required
                    className="w-full outline-none text-black p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="mb-4 flex grid-cols-2 gap-4 w-full">
                <div className="w-1/4">
                  <label
                    htmlFor="email"
                    className="block text-lg text-start font-medium mb-2"
                  >
                    Correo Electronico:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ingrese su correo electronico"
                    required
                    maxLength={100}
                    className="w-full text-black outline-none p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="telefono"
                    className="block text-start text-lg font-medium mb-2"
                  >
                    Numero de contacto:
                  </label>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ejemplo: 3001234567"
                    maxLength={10}
                    pattern="\d{10}"
                    title="El número de contacto debe tener 10 dígitos."
                    required
                    className="w-full outline-none p-2 border border-gray-300 text-black rounded-lg"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="mensaje"
                  className="block text-lg text-start font-medium mb-2"
                >
                  Mensaje:
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Escriba su mensaje aquí..."
                  required
                  maxLength={50}
                  className="w-full outline-none p-2 border border-gray-300 text-black rounded-lg"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-customYellow mx-auto text-white px-4 py-2 rounded hover:bg-customYellow/85 text-lg font-bold w-1/4"
              >
                {loading ? (
                  <span className="animate-spin">Enviando...</span>
                ) : (
                  <span>Enviar</span>
                )}
              </button>
              {error && (
                <div className="bg-red-500 text-white p-2 mb-2 rounded font-bold text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-500 text-white p-2 mb-2 rounded font-bold text-center">
                  {success}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
