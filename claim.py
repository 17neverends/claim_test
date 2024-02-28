from fastapi import FastAPI, Form, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
def tarifs():
    return HTMLResponse(
        content=open(
            "static/claim/index.html", "r", encoding="utf-8"
        ).read()
    )

@app.post("/submit_form")
async def submit_form(
    email: str = Form(...),
    fullname: str = Form(...),
    amount: float = Form(...),
    desc: str = Form(...),
    files: list[UploadFile] = File(...),
):
    try:
        for file in files:
            print(f"Received file: {file.filename}, content type: {file.content_type}")

        return {"status": "success", "message": "Данные успешно получены"}
    except Exception as e:
        print(f"Error processing form data: {e}")
        raise

