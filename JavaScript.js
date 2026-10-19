window.handleAddProduct = async function(event) {
    event.preventDefault();
    const title = document.getElementById('pTitle').value;
    const price = document.getElementById('pPrice').value;
    const fileInput = document.getElementById('pImageFile');
    
    if (fileInput.files.length === 0) return;
    const file = fileInput.files[0];

    const reader = new FileReader();
    reader.onload = async function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = async function() {
            // ضغط الصورة وتصغير أبعادها لضمان رفعها بسرعة وبحجم صغير
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 500;
            const scaleFactor = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleFactor;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // ضغط جودة الصورة إلى 70%

            try {
                await addDoc(collection(db, "products"), {
                    title: title,
                    price: price,
                    image: compressedBase64,
                    createdAt: new Date()
                });
                document.getElementById('addProductForm').reset();
                alert("تمت إضافة العطر بنجاح وتخزينه سحابياً!");
                fetchProducts();
            } catch (error) {
                console.error("خطأ في الإضافة: ", error);
                alert("حدث خطأ أثناء حفظ المنتج.");
            }
        };
    };
    reader.readAsDataURL(file);
      }
          
