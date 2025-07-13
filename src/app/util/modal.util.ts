export function openModalById(modalId: string) { 
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    modal.showModal();
}

export function closeModalById(modalId: string) { 
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    modal.close();
}