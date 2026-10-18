var APP_DATA = {
  "scenes": [
    {
      "id": "0-fachada",
      "name": "Fachada",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1500,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 0.2699312779115637,
          "pitch": 0.014250498079597662,
          "rotation": 0,
          "target": "1-entrada-da-loja"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-entrada-da-loja",
      "name": "Entrada da Loja",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1500,
      "initialViewParameters": {
        "yaw": -0.4779516829034467,
        "pitch": 0.003759513653534441,
        "fov": 1.3365071038314758
      },
      "linkHotspots": [
        {
          "yaw": -0.7289939671902577,
          "pitch": 0.16090760702522644,
          "rotation": 0,
          "target": "2-centro-da-loja",
          "targetViewParameters": {
            "yaw": -1.5961463313595914,
            "pitch": -0.004066763302443377,

          }
        },
        {
          "yaw": 2.8644215199957745,
          "pitch": 0.06405689862955555,
          "rotation": 0,
          "target": "0-fachada",
          "targetViewParameters": {
            "yaw": -2.9275485738776954,
            "pitch": -0.004530666147687157,
       }
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "2-centro-da-loja",
      "name": "Centro da Loja",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1500,
      "initialViewParameters": {
        "yaw": 0.022525189491537034,
        "pitch": 0.030075018254301256,
        "fov": 1.3365071038314758
      },
      "linkHotspots": [
        {
          "yaw": -1.4820095085259695,
          "pitch": 0.1988016376794306,
          "rotation": 0,
          "target": "3-estoque"
        },
        {
          "yaw": 1.5897522006809073,
          "pitch": 0.14830556194550404,
          "rotation": 0,
          "target": "1-entrada-da-loja",
          "targetViewParameters": {
            "yaw": 2.5403212195435234,
            "pitch": -0.07702132451067989,

          }
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "3-estoque",
      "name": "Estoque",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1500,
      "initialViewParameters": {
        "yaw": -1.5942169366091772,
        "pitch": -0.0015817896267638076,
        "fov": 1.3365071038314758
      },
      "linkHotspots": [
        {
          "yaw": 1.6128824892809597,
          "pitch": 0.15041439342013874,
          "rotation": 0,
          "target": "2-centro-da-loja",
          "targetViewParameters": {
            "yaw": 1.5789315450440196,
            "pitch": -0.03504574891534418,

          }
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "Project Title",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": true,
    "fullscreenButton": false,
    "viewControlButtons": false
  }
};
