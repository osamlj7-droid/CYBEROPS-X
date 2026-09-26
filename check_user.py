from core.security import verify_password
hash_str = "$2b$12$ix.66/JSVet.QHWNtyaUqe6hVRnCz/PltTaz0u.FJlGinGVLcOJaS"
print("Verify:", verify_password("admin123", hash_str))
