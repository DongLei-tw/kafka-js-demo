# Assess with Python

```sh
cd python

# create virtual env
python3 -m venv ./venv

# install avro
python3 -m pip install avro

# run the app
python3 app.py
```

You will see the same issue

```
Encoded bytes: b'\x00\x0cAlbertf\xe6\xf6B\xcd\xcc\xcc\xcc\xcc\xdc^@'
Decoded data: {'kind': 'CAT', 'name': 'Albert', 'height': 123.44999694824219, 'length': 123.45}
```

```sh
# exit python venv
deactivate
```